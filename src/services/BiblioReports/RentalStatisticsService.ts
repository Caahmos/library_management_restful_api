import prisma from "../../prisma/prisma";

class RentalStatisticsService {
  static async execute() {
    const rentals = await prisma.biblioStatusHist.groupBy({
        by: ["status_begin_dt"],
        _count: {
            status_begin_dt: true,
        },
        orderBy: {
            status_begin_dt: "asc",
        },
    });

    const monthlyRentals: { [key: string]: number } = {};

    rentals.forEach((rental) => {
        const month = rental.status_begin_dt.toISOString().slice(0, 7);
        monthlyRentals[month] = (monthlyRentals[month] || 0) + rental._count.status_begin_dt;
    });

    const formattedData = Object.keys(monthlyRentals).map((month) => ({
        month,
        total_rentals: monthlyRentals[month],
    }));

    return formattedData;
  }
}

export default RentalStatisticsService;
