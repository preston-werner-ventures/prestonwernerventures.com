import { Controller } from "stimulus";

export default class extends Controller {
  static get targets() {
    return ["filters", "category", "year", "location", "legend", "tile"];
  }

  connect() {
    this._updateFilters();
    this._filter();
  }

  disconnect() {}

  // when one of the filter dropdowns change
  change() {
    this._updateHash();
    this._filter();
  }

  clear(event) {
    event.preventDefault();

    this.filtersTarget.reset();
    this._updateHash();
    this._filter();
  }

  toggleLegend() {
    this.legendTarget.classList.toggle("hidden");
  }
  // pulls the filter names and values out of the hash
  _parseHash() {
    const filters = {};
    location.hash
      .substring(1)
      .split("&")
      .map(part => part.split("="))
      .forEach(group => {
        filters[group[0]] = decodeURIComponent(group[1]);
      });
    return filters;
  }

  // updates the filter dropdowns to match whatever is in the hash
  _updateFilters() {
    const filters = this._parseHash();

    console.info(filters);

    if (filters.category) this.categoryTarget.value = filters.category;
    if (filters.year) this.yearTarget.value = filters.year;
    if (filters.location) this.locationTarget.value = filters.location;
  }

  // sets the hash to the selected values in the filters
  _updateHash() {
    let newHash = [];

    if (this.isCategoryFiltered) newHash.push(`category=${this.categoryFilter}`);
    if (this.isYearFiltered) newHash.push(`year=${this.yearFilter}`);
    if (this.isLocationFiltered) newHash.push(`location=${this.locationFilter}`);

    location.hash = newHash.join("&");
  }

  // actually shows/hides tiles based on what's selected in the dropdowns
  _filter() {
    // if no filters are selected then immediately show everything
    if (!this.isCategoryFiltered && !this.isYearFiltered && !this.isLocationFiltered) {
      this.tileTargets.forEach(tile => this._show(tile));
    }

    // loop through each tile and figure out if should be shown or not
    this.tileTargets.forEach(tile => {
      const tileYears = tile.dataset.years.split(",");
      const tileLocations = tile.dataset.locations.split(",");
      let showTile = true;

      showTile = showTile && this._isVisibleInCategory(tile);
      showTile = showTile && this._isVisibleInYear(tile);
      showTile = showTile && this._isVisibleInLocation(tile);

      showTile ? this._show(tile) : this._hide(tile);
    });
  }

  _isVisibleInCategory(tile) {
    if (!this.isCategoryFiltered) {
      return true;
    } else {
      const tileCategories = tile.dataset.categories.split(",");
      return tileCategories.indexOf(this.categoryFilter) !== -1;
    }
  }

  _isVisibleInYear(tile) {
    if (!this.isYearFiltered) {
      return true;
    } else {
      const tileYears = tile.dataset.years.split(",");
      return tileYears.indexOf(this.yearFilter) !== -1;
    }
  }

  _isVisibleInLocation(tile) {
    if (!this.isLocationFiltered) {
      return true;
    } else {
      const tileLocations = tile.dataset.locations.split(",");
      return tileLocations.indexOf(this.locationFilter) !== -1;
    }
  }

  _show(tile) {
    tile.classList.remove("hidden");
  }

  _hide(tile) {
    tile.classList.add("hidden");
  }

  get categoryFilter() {
    return this.categoryTarget.value;
  }

  get yearFilter() {
    return this.yearTarget.value;
  }

  get locationFilter() {
    return this.locationTarget.value;
  }

  get isCategoryFiltered() {
    return this.categoryFilter !== "";
  }

  get isYearFiltered() {
    return this.yearFilter !== "";
  }

  get isLocationFiltered() {
    return this.locationFilter !== "";
  }
}
