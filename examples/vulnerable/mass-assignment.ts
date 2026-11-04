// VULNERABLE EXAMPLE - do not copy into production code.
// app/api/profile/route.ts

declare const prisma: any;
declare function getSession(): Promise<{ userId: string }>;

export async function PATCH(request: Request) {
  const session = await getSession();
  const body = await request.json();
  // Every key in the body is written: { "role": "admin" } or
  // { "emailVerified": true } changes fields the user must never control.
  const user = await prisma.user.update({ where: { id: session.userId }, data: body });
  return Response.json(user);
}
