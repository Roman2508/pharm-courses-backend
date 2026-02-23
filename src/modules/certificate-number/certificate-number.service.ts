import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CertificateStatus } from 'prisma/generated/enums';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TransactionClient } from 'prisma/generated/internal/prismaNamespace';

// Номер останнього виданого сертифіката — задається один раз тут
const CERT_START = 345;

// Фіксований номер реєстрації закладу в провайдерах БПР
const BPR_PROVIDER_ID = '2044';

@Injectable()
export class CertificateNumberService {
  constructor(private readonly prisma: PrismaService) {}
  // Основний метод — приймає tx ззовні, без власної транзакції.
  // Викликається з updateEnabled в RegistrationsService в рамках його транзакції.
  async issue(tx: TransactionClient, registrationId: number) {
    const registration = await tx.registration.findUnique({
      where: { id: registrationId },
      include: { course: true },
    });

    if (!registration) {
      throw new NotFoundException(`Реєстрацію #${registrationId} не знайдено`);
    }

    const existing = await tx.certificateNumber.findFirst({
      where: { registrationId, status: CertificateStatus.ASSIGNED },
    });

    if (existing) {
      throw new ConflictException(
        `Учасник вже має активний номер сертифіката: ${existing.certificateNumber}`,
      );
    }

    // Шукаємо найменший звільнений номер для заповнення пробілу
    const releasedCert = await tx.certificateNumber.findFirst({
      where: {
        courseId: registration.courseId,
        status: CertificateStatus.RELEASED,
      },
      orderBy: { sequentialNumber: 'asc' },
    });

    if (releasedCert) {
      // Перевикористовуємо звільнений номер — старий запис RELEASED залишається для аудиту
      return tx.certificateNumber.create({
        data: {
          courseId: registration.courseId,
          registrationId,
          certificateNumber: releasedCert.certificateNumber,
          sequentialNumber: releasedCert.sequentialNumber,
          status: CertificateStatus.ASSIGNED,
          assignedAt: new Date(),
        },
      });
    }

    // Звільнених немає — генеруємо новий номер
    const updatedCourse = await tx.course.update({
      where: { id: registration.courseId },
      data: { certCounter: { increment: 1 } },
    });

    const sequentialNumber = CERT_START + updatedCourse.certCounter - 1;
    const paddedNumber = String(sequentialNumber).padStart(5, '0');
    const year = registration.course.yearOfInclusionToBpr;
    const bprEventId = registration.course.numberOfInclusionToBpr;
    const certificateNumber = `${year}-${BPR_PROVIDER_ID}-${bprEventId}-1${paddedNumber}`;

    return tx.certificateNumber.create({
      data: {
        courseId: registration.courseId,
        registrationId,
        certificateNumber,
        sequentialNumber,
        status: CertificateStatus.ASSIGNED,
        assignedAt: new Date(),
      },
    });
  }

  // Основний метод — приймає tx ззовні, без власної транзакції.
  async release(tx: TransactionClient, registrationId: number) {
    const cert = await tx.certificateNumber.findFirst({
      where: { registrationId, status: CertificateStatus.ASSIGNED },
    });

    if (!cert) {
      throw new NotFoundException(
        `Активний сертифікат для реєстрації #${registrationId} не знайдено`,
      );
    }

    return tx.certificateNumber.update({
      where: { id: cert.id },
      data: {
        status: CertificateStatus.RELEASED,
        releasedAt: new Date(),
      },
    });
  }

  // Обгортки для прямих HTTP викликів з контролера
  async issueStandalone(registrationId: number) {
    return this.prisma.$transaction((tx) => this.issue(tx, registrationId));
  }

  async releaseStandalone(registrationId: number) {
    return this.prisma.$transaction((tx) => this.release(tx, registrationId));
  }
}
