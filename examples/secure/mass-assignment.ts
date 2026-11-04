// SECURE EXAMPLE
// app/api/profile/route.ts

import { z } from 'zod';

declare const prisma: any;
declare function getSession(): Promise<{ userId: string }>;

// Only the fields a user may edit. zod strips any other keys.
const UpdateProfile = z.object({
  name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  const data = UpdateProfile.parse(await request.json());
  const user = await prisma.user.update({ where: { id: session.userId }, data });
  return Response.json(user);
}
