export function generateBookingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "BK-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateWhatsAppLink(
  whatsappNumber: string,
  providerName: string,
  serviceNames: string,
  date: string,
  time: string,
  bookingId: string
): string {
  const message = `Hi, I want to book ${providerName} for ${serviceNames} on ${date} at ${time}. Booking ID: ${bookingId}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
