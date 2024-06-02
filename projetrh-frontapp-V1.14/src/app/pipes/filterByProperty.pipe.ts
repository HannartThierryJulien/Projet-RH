import {Pipe, PipeTransform} from "@angular/core";

/**
 * Pipe not user anymore (01/06/2024) cause lists were replaced by table (with embedded search/filter methods).
 *
 * Was previously used to search in a list, using a specific filter or not.
 */
@Pipe({
  name: 'filterByProperty'
})
export class FilterByPropertyPipe implements PipeTransform {
  transform(items: any[], searchText: string, filterProperty: string): any[] {
    if (!items || !searchText) return items;

    return items.filter(item => {
      // If no filter selected, search in all objet's attribute
      if (!filterProperty) {
        return this.searchInObject(item, searchText);
      } else { // If a filter is selected, search value for a specific attribute
        const itemValue = this.getPropertyValue(item[filterProperty]);
        return itemValue && itemValue.includes(searchText.toLowerCase());
      }
    });
  }

  private searchInObject(obj: any, searchText: string): boolean {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object') { // If attribute is an object
          if (this.getPropertyValue(value).includes(searchText.toLowerCase())) {
            return true;
          }
        } else if (typeof value === 'string' || typeof value === 'number') { // If the attribute is a string or a number
          if (this.getPropertyValue(value).includes(searchText.toLowerCase())) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Flemme de traduire :)
   *
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
