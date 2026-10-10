
'use server';

import { z } from 'zod';

const OrderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
});

export async function placeOrder(prevState, formData) {
  const parsed = OrderSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const session = await getSession();
  if (!session) return { error: 'Not signed in' };

  await db.orders.create({ ...parsed.data, userId: session.userId });
  return { success: true };
}