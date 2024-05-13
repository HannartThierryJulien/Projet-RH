import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'filterByProperty'
})
export class FilterByPropertyPipe implements PipeTransform {
  transform(items: any[], searchText: string, filterProperty: string): any[] {
    if (!items || !searchText) return items;

    return items.filter(item => {
      if (!filterProperty) { // Si aucun filtre n'est sélectionné
        return this.searchInObject(item, searchText);
      } else { // Si un filtre est sélectionné
        const itemValue = this.getPropertyValue(item[filterProperty]);
        return itemValue && itemValue.includes(searchText.toLowerCase());
      }
    });
  }

  private searchInObject(obj: any, searchText: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') { // Si l'attribut est un objet
          if (this.getPropertyValue(value).includes(searchText.toLowerCase())) {
            return true;
          }
        } else if (typeof value === 'string' || typeof value === 'number') { // Si l'attribut est une chaîne de caractères ou un nombre
          if (this.getPropertyValue(value).includes(searchText.toLowerCase())) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Si l'objet ("item") qu'on filtre a des attributs autres que string/number, alors on vérifie si ces attributs sont
   * des objets ayant eux même des attributs 'label'.
   *
   * Exemple : Sans la méthode getPropertyValue(), un utilisateur est capable de rechercher une QUESTION via ses attributs
   * label, id, weight,  et archived. Mais ça ne fonctionne pas pour les attributs questionnaire et topic qui ne sont pas des
   * string ou des number, la méthode getPropertyValue() entre donc en jeux pour vérifier si ces deux attributs ont eux-mêmes
   * l'attribut "label".
   *
   * @param item
   * @private
   */
  private getPropertyValue(item: any): string {
    return item && item.hasOwnProperty('label') ? String(item.label).toLowerCase() : String(item).toLowerCase();
  }
}
