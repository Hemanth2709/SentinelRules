# Missing authorization: remediation

## Vulnerable

```ts
@Controller('projects')
export class ProjectsController {
  @Delete(':id')
  remove(@Param('id') id: string) {
    return db.project.delete({ where: { id } });
  }
}
```

## Corrected

```ts
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    const project = await db.project.findUnique({ where: { id } });
    if (!project || project.ownerId !== req.user.id) {
      throw new ForbiddenException();
    }
    return db.project.delete({ where: { id } });
  }
}
```

Full files: [vulnerable](../../../examples/vulnerable/missing-authorization.ts),
[secure](../../../examples/secure/missing-authorization.ts).

## Why this fixes it

The guard authenticates the caller; the ownership check authorizes the action
on this specific project. Both are needed.

## NestJS guidance

- Register authentication as a global guard (`APP_GUARD`) and opt routes
  *out* with a `@Public()` decorator checked by the guard. Deny-by-default is
  safer than remembering `@UseGuards` on every controller.
- Put resource-level checks in the service or a policy layer (e.g. CASL) and
  scope queries by owner/tenant (`where: { id, ownerId }`).

## Next.js guidance

```ts
export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  await db.project.delete({ where: { id, ownerId: session.user.id } });
  return NextResponse.json({ deleted: id });
}
```

- Check the session inside every Route Handler and Server Action; do not rely
  only on middleware or on the UI hiding a button.
- Centralise checks in a data-access layer that requires a verified session.
