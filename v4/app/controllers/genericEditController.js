define([ '../ngmodule' ], function(appModule) {

    var basicEditController = function($scope, $stateParams, objectService, $state, entityService, entityConfig, loggerService, $document) {
        var entityCollection = $scope.entityCollection;
        $scope.itemId = $stateParams.itemId;
        var entityKind = entityCollection.name;

        var original = {};
        $scope.editing.obj = {};
        
        var entityInfo = entityKind + '/' + $scope.itemId;

        var successCallback = function(result) {
            $scope.$apply(function() {
                $scope.editing.original = result;
                $scope.viewLink = 'view.html?' + result.id;
                
                entityService.copyFieldsFromEntity(result, $scope.editing.obj, entityCollection.fields);

                $scope.statusInfo('Editing entity ' + entityInfo)
            });
        };

        var errorCallback = function() {
            $scope.$apply(function() {
                $scope.editing.obj = null;
                $scope.statusError('Entity not found: ' + entityInfo);
            });
        };

        entityService.fetchObject(entityKind, $scope.itemId, successCallback, errorCallback);

        if (entityKind == 'exercise') {
            // we also need to fetch the styles and the templates:
            entityService.fetchItems(entityConfig.style, $scope);
            entityService.fetchItems(entityConfig.template, $scope);
        }
        // $scope.editing.obj= objCopy(original);

        $scope.editingChange = function() {
            entityService.copyFieldsToEntity($scope.editing.obj, $scope.editing.original, $scope.entityCollection.fields);
        }

        $scope.refreshPreview = function(){
            var iframes = $document.find('iframe');
            if(iframes.length==1){
                iframes[0].contentWindow.location.reload();
            }
        }
        
        $scope.save = function() {
            $scope.statusInfo('Saving ' + entityInfo);

            $scope.editing.original.save({
                success : function() {
                    loggerService.infoNonNg("Saving succeeded for " + entityInfo);
                    $scope.refreshPreview();
                },
                error : function(obj, error) {
                    loggerService.errorNonNg("Saving failed for " + entityInfo + "\nError code: " + error.code+', message: '+error.message);
                }
            });
        };

        $scope.deleteItem = function() {

            if(!confirm('Delete the current item?')){
                return;
            }

            var item = $scope.editing.original;
            item.destroy({
                success : function() {
                    loggerService.infoNonNg('Deleted ' + entityInfo);
                    $scope.$apply(function() {
                        $state.go(entityKind, {}, {
                            reload : true
                        })
                    });
                },
                error : function(obj, err) {
                    loggerService.errorNonNg('Deleted ' + entityInfo);
                }
            });
        }

        $scope.duplicateItem = function() {

            var item = $scope.editing.obj;
            var nameProperty = entityCollection.nameProperty;

            $scope.statusInfo('Duplicating ' + entityInfo);

            duplicate = objectService.copy(item);
            duplicate[nameProperty] += ' - COPY';

            var parseDuplicate = entityService.createNew(entityCollection, duplicate);

            parseDuplicate.save({
                success : function(savedDuplicate) {
                    var editState = entityKind + '.edit'
                    $scope.$apply(function() {
                        $state.go(editState, {
                            itemId : savedDuplicate.id
                        }, {
                            reload : true
                        });
                    });
                },
                error : function(obj, err) {
                    loggerService.errorNonNg('Error duplicating: code ' + err.code+', message: '+err.message);
                }
            });
        }

    };

    appModule.config(function($controllerProvider, entityConfig) {
        entityConfig.entities.forEach(function(entity) {
            var controllerName = entity.name + 'EditController';
            $controllerProvider.register(controllerName, basicEditController);
        });
    });
})