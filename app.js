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
    menu.foundItemnsCount = ""; //cantidad de items found
    menu.cantItemsCarrito = 0; //items en el carrito
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


menu.getTotal = function(){

if (menu.carrito) { //checks if menu.carrito != empty
var total = 0;
    for(var i = 0; i < menu.carrito.length; i++){
      total = total + menu.carrito[i].price_large;
    }
    return total;

  }else {
    return 0;
  }

};


    menu.sortBy = function(propertyName) {

      switch(propertyName) {

          case '-price_large':
              menu.found.sort(function (a, b){return (b.price_large - a.price_large)});
              break;

          case 'price_large':
              menu.found.sort(function (a, b){return (a.price_large - b.price_large)});
              break;

              case '-short_name':

    menu.found.sort(function (a, b){

    var x = b.short_name.toLowerCase();
    var y = a.short_name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;});

                  break;

              case 'short_name':

    menu.found.sort(function (a, b){

      var x = a.short_name.toLowerCase();
      var y = b.short_name.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;});
                  break;

      }

  };


    menu.agregar_carrito = function (index) {

      menu.carrito.push(menu.found[index]);
      menu.cantItemsCarrito =menu.carrito.length;
      menu.found[index].buttonState = "w3-hide";

    };

    menu.borrarCarritoItem = function (index) {
     menu.found[index].buttonState = "w3-show";
      menu.carrito.splice(index, 1);
      menu.cantItemsCarrito =menu.carrito.length;

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


  //HTML Directives
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

// poner botones de filtro carrito y busqueda en barra negra cuando pantalla es chica

})();
