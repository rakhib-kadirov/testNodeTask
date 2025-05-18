import express, { Request, Response } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import cors from 'cors'

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Создать обращение
app.post('/appeals', async (req: Request, res: Response) => {
  try {
    const { topic, message }: { topic: string, message: string } = req.body;

    const appeal = await prisma.appeal.create({
      data: {
        topic,
        message,
        status: Status.NEW,
        createdAt: new Date(),
      },
    });

    res.status(201).json(appeal);
  }
  catch (error) {
    console.log("Error", error)
    res.status(500).json(error)
  }
});

// Взять обращение в работу
app.get('/appeals/:id/start', async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.appeal.update({
      where: { id: Number(id) },
      data: { status: Status.IN_PROGRESS },
    });

    res.status(201).json(updated);
  } catch (error) {
    res.json("error");
    console.log('ERROR', error)
  }
});

// Завершить обращение
app.put('/appeals/:id/complete', async (req, res) => {
  try {
    console.log('BODY:', req.body);
    const { id } = req.params;
    const { resolutionText } = req.body;

    const updated = await prisma.appeal.update({
      where: { id: Number(id) },
      data: {
        status: Status.COMPLETED,
        resolutionText,
      },
    });

    res.status(201).json(updated);
  } catch (error) {
    res.json("error");
    console.log('ERROR', error)
  }
});

// Отменить обращение
app.put('/appeals/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const updated = await prisma.appeal.update({
      where: { id: Number(id) },
      data: {
        status: Status.CANCELED,
        cancellationReason,
      },
    });

    res.status(200).json({ updated, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Получить список обращений с фильтрацией
app.get('/appeals', async (req, res) => {
  const { date, from, to } = req.query;
  const filters: any = {};

  if (date) {
    const parsed = new Date(date as string);
    if (!isNaN(parsed.getTime())) {
      filters.createdAt = {
        gte: new Date(parsed.setHours(0, 0, 0, 0)),
        lte: new Date(parsed.setHours(23, 59, 59, 999)),
      };
    }
  } else if (from && to) {
    const fromDate = new Date(from as string);
    const toDate = new Date(to as string);

    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      filters.createdAt = {
        gte: fromDate,
        lte: toDate,
      };
    }
  }

  try {
    const appeals = await prisma.appeal.findMany({
      where: filters,
    });
    res.json(appeals);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка получения данных');
  }
});

// Отменить все "в работе"
app.put('/appeals/cancel-in-work', async (req, res) => {
  const { cancellationReason } = req.body;

  const result = await prisma.appeal.updateMany({
    where: { status: Status.IN_PROGRESS },
    data: {
      status: Status.CANCELED,
      cancellationReason,
    },
  });

  res.json({ message: `Canceled ${result.count} appeals` });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
