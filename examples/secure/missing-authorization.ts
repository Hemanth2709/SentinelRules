// SECURE EXAMPLE

import { Controller, Delete, ForbiddenException, Param, Req, UseGuards } from '@nestjs/common';

declare const JwtAuthGuard: any;
declare const db: any;

@UseGuards(JwtAuthGuard) // authentication: the caller must be signed in
@Controller('projects')
export class ProjectsController {
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    // Authorization: the caller must own this specific project.
    const project = await db.project.findUnique({ where: { id } });
    if (!project || project.ownerId !== req.user.id) {
      throw new ForbiddenException();
    }
    return db.project.delete({ where: { id } });
  }
}
