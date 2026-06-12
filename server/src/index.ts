import express from 'express';
import cors from 'cors';
import { prisma } from './prisma.config';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(compression());


app.get("/api/orders", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
const skip = (page - 1) * limit;


    const total = await prisma.order.count();
    const totalPages = Math.ceil(total / limit);

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            id:true , 
            email:true,
            avatarUrl:true,
            address:true,
            bio:true,
          },
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                image: true,
                category: true,
              },
            },
          },
        },
      },
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch orders",
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: "optimized" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
