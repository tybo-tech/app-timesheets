import { Pipe, PipeTransform } from '@angular/core';
import { Project } from 'src/models/project.model';

@Pipe({
  name: 'searchByName'
})
export class SearchByNamePipe implements PipeTransform {

  transform(value: Project[], args?: string): any {
    if (!value || !value.length || !args) {
      return value;
    }
    return value.filter(x =>
      x.ProjectName.toLocaleLowerCase().includes(args.toLocaleLowerCase())
      || x.OrganizationName.toLocaleLowerCase().includes(args.toLocaleLowerCase())
      || x.ApproverEmail.toLocaleLowerCase().includes(args.toLocaleLowerCase())
    )

  }

}
