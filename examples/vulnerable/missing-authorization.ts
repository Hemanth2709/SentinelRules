// VULNERABLE EXAMPLE - do not copy into production code.

import { Controller, Delete, Param } from '@nestjs/common';

declare const db: any;

@Controller('projects')
export class ProjectsController {
  // No guard on the controller or the route, and no global guard in this
  // application: anyone can delete any project by guessing its id.
  @Delete(':id')
  remove(@Param('id') id: string) {
    return db.project.delete({ where: { id } });
  }
}
