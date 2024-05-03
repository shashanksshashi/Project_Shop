var projectShop = angular.module('projectShop', []);
projectShop.service('productService', function($http) {
    this.addProduct = function(newProductName, newUnitCost) {
        // Create a new product object
        var newProduct = {
            id: 0, // at first set the id to 0, and in future new id will be assigned by the server
            name: newProductName,
            unitCost: parseFloat(newUnitCost) // Ensure unitCost is numeric
        };
        
        // Send a POST request to add the new product
        return $http.post('http://localhost:3000/products', newProduct)
            .then(function(response) {
                return response.data; // Return the newly added product
            })
            .catch(function(error) {
                console.log('Error adding product:', error); // To show the error in console
            });
    };
});

projectShop.controller('shopController', function($scope, $http, productService){
    // Initialize an empty shopping cart
    $scope.shoppingCart = [];

    // Fetch our product data from the JSON server 
    $http.get('http://localhost:3000/products')
        // Assigning fetched data to $scope.products
        .then(function(response){
            $scope.products = response.data; 
        })
        // To handle errors that might occur during the execution of this asynchronous operation.
        .catch(function(error){
            console.log('Error fetching product data:', error);
        });

    // Function to add a new product
    $scope.onAddNew = function(newProductName, newUnitCost) {
        productService.addProduct(newProductName, newUnitCost)
            .then(function(newProduct) {
                // Once the product is added successfully, add it to the products list
                $scope.products.push(newProduct);
            });
    };

    // Function to add a product to the shopping cart
    $scope.onAddToCart = function(product) {
        // Check if the product already exists in the shopping cart
        var currentItem = $scope.shoppingCart.find(function(item) {
            return item.product.id === product.id;
        });
        if (currentItem) {
            // If the product already exists, just increase its units
            currentItem.units++;
        } else {
            // If the product doesn't exist, add it to the shopping cart
            $scope.shoppingCart.push({product: product, units: 1});
            // Mark the product as added
            product.added = true;
        }
    };
    // Function to remove a product from the shopping cart
    $scope.onRemove = function(product) {
        // Remove the product from the shopping cart
        var index = $scope.shoppingCart.indexOf(product);
        if (index !== -1) {
            $scope.shoppingCart.splice(index, 1);
        }
    };

    // Function to calculate the total amount in the shopping cart
    $scope.getTotalAmount = function() {
        var total = 0;
        // Iterate through each item in the shopping cart and calculate its cost
        $scope.shoppingCart.forEach(function(item) {
            total += item.product.unitCost * item.units;
        });
        return total;
    };

    $scope.updateShopCart = function(){
        // Its an empty function for ng-change
    }
    
});
