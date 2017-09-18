var storefrontApp = angular.module('storefrontApp');

storefrontApp.controller('recentlyAddedListItemDialogController', ['$scope', '$window', '$uibModalInstance', 'dialogData', 'listService', '$translate', '$localStorage', 'customerService', function ($scope, $window, $uibModalInstance, dialogData, listService, $translate, $localStorage, customerService) {
    $scope.availableLists = [];
    $scope.selectedList = {};

    dialogData.product.imageUrl = dialogData.product.primaryImage.url;
    dialogData.product.createdDate = new Date;
    dialogData.product.productId = dialogData.product.price.productId;
    _.extend(dialogData.product, dialogData.product.price);
    _.extend(dialogData.product, dialogData.product.salePrice);

    $scope.dialogData = dialogData.product;
    $scope.dialogData.quantity = dialogData.quantity;
    console.log($scope);
    $scope.inProgress = false;
    $scope.itemAdded = false;


    $scope.addProductToList = function () {
        $scope.inProgress = true;
        var customer = { userName: $scope.userName, id: $scope.userId, isRegisteredUser: true };

        console.log($scope.userName, $scope.selectedList.author, 'scope');
        if ($scope.userName !== $scope.selectedList.author) {
            dialogData.product.modifiedBy = $scope.userName;

        }
        listService.addItemToList($scope.selectedList.id, dialogData.product);

        $scope.inProgress = false;
        $scope.itemAdded = true;
    }
    $scope.selectList = function (list) {
        $scope.selectedList = list;
    };

    $scope.close = function () {
        $uibModalInstance.close();
    };
    $scope.redirect = function (url) {
        $window.location = url;
    }

    $scope.initialize = function (lists) {
        customerService.getCurrentCustomer().then(function (user) {
            $scope.userName = user.data.userName;
            console.log(user.data);
            $scope.userId = user.data.id;
            $scope.lists = $localStorage['lists'][$scope.userName];
            $scope.sharedLists = listService.getSharedLists($scope.userName);

            angular.forEach($scope.lists, function (list) {
                list.title = list.name;
                list.description = list.name;
                var contains = listService.containsInList(dialogData.product.id, list.id).contains;
                list.contains = contains;
            });
            angular.forEach($scope.sharedLists, function (list) {
                list.title = list.name;
                list.description = list.name;
                var contains = listService.containsInList(dialogData.product.id, list.id).contains;
                list.contains = contains;
            });
        })
    };
}]);
