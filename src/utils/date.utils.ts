function getISOWeek(date: Date): string {
    const temp = new Date(date);

    // Set to nearest Thursday (ISO standard)
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));

    const week1 = new Date(temp.getFullYear(), 0, 4);

    const weekNumber =
        1 +
        Math.round(
            ((temp.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7
        );

    return `${temp.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

export default getISOWeek;
