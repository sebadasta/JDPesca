(function () {
  angular.module("jdpescaApp", [])
    .controller("NarrowItDownController", NarrowItDownController)
     .service("MenuSearchService", MenuSearchService)
     .directive("foundItems", FoundItems)
     .directive("carritoItems", CarritoItems)
     .constant("REST_API_URL", "//davids-restaurant.herokuapp.com/menu_items.json");

  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.foundItemnsCount = "";
    menu.searchTerm = ""; //item to search
    menu.showError = false; //flag to hide/show Error Message

    menu.narrowItDown = function () { //function to start searching items

      menu.found = {};
      menu.carrito = MenuSearchService.carritoArray;

      if (menu.searchTerm) { //checks if menu.searchTerm != empty
        var foundItemsPromise = MenuSearchService.getMatchedMenuItems(menu.searchTerm.toLowerCase());
        foundItemsPromise.then(function (items) {
          menu.found = items;
              menu.foundItemnsCount = items.length;
          menu.setShowError();
        });
      } else {
        menu.setShowError();
      }
    };

    menu.agregar_carrito = function (index) {

      menu.carrito.push(menu.found[index]);
        console.log(menu.carrito);

    };

    menu.borrarCarritoItem = function (index) {

      menu.carrito.splice(index, 1);
  console.log(menu.carrito);

    };

    menu.setShowError = function () {
      menu.showError = (menu.found.length === 0);
    };
  }
  //


  MenuSearchService.$inject = ["$http", "REST_API_URL"];
  function MenuSearchService($http, REST_API_URL) {
    var service = this;

    service.carritoArray = [];

    service.getMatchedMenuItems = function (searchTerm) {//searchItems method
      return $http({
        method: 'GET',
        url: REST_API_URL,
      }).then(function (response) {

        return response.data.menu_items.filter(function (item) {
          return item.description.indexOf(searchTerm) !== -1;
        });
      }).catch(function (error) {
        console.log(error);
      });
    };



  }
  //
  function FoundItems() {//ddo incharge of showing foundItems
    var ddo = {
      templateUrl: "productos.html",
      scope: {
        items: "<",
        itemsCarrito: "<",
        error: "<",
        onRemove: "&",
        agregarCarrito: "&"
      }
    };

    return ddo;
  }


  function CarritoItems() {//ddo incharge of showing CarritoItems
    var ddo = {
      templateUrl: "carritoItems.html",
      scope: {
        items: "=",
        itemsCarrito: "=",
        error: "<",
        onRemove: "&"

      }
    };

    return ddo;
  }



})();
