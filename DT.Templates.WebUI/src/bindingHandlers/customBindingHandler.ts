import ko = require("knockout");

ko.bindingHandlers["yourBindingName"] = {
    init: function (element: HTMLElement, valueAccessor: () => any, allBindings, viewModel, bindingContext: KnockoutBindingContext) {
        // Use ko.unwrap(valueAccessor()) to get / observe the value from valueAccessor, if its an observable or not
        // Use ko.applyBindingsToNode to apply default bindings to element

        //ko.applyBindingsToNode(element, {
        //    
        //});

        ko.applyBindingsToNode(element, {
            text: ko.computed(() => {
                return ko.unwrap(valueAccessor());
            })
        });
    },
    update: function (element: HTMLElement, valueAccessor: () => any, allBindings, viewModel, bindingContext: KnockoutBindingContext) {
        // Note: Using update is not recommended
    }
}; 