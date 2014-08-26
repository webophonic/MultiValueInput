(function ($) {

    $.fn.irMultiValue = function (options) {

        this.filter("input:text").each(function () {

            var methods = {
                _acceptValue: function (value) {
                    var existsTest = settings.allowMultiple || (components.data.indexOf(value) < 0);
                    return existsTest && ((settings.regex == null) || value.match(settings.regex));
                    },
                _onDataChange: function () {
                    components.originalInput.val(components.data.join(settings.separator));
                    eval(settings.onDataChange);
                },
                _onOrderChange: function () {
                    components.originalInput.val(components.data.join(settings.separator));
                    eval(settings.onDataChange);
                },
                _redraw: function () {
                    components.multiValueItemsContainer.empty();
                    components.data.forEach(function (value) {
                        var valueObject = $(settings.valueTemplate).html(value);
                        var item = $(settings.itemTemplate).append(valueObject);
                        item.data('data', value);
                        var remover = $(settings.removerTemplate);
                        remover.css('cursor', 'pointer');
                        remover.click(function () {
                            components.data.splice(components.data.indexOf(item.data('data')), 1);
                            item.remove();
                            methods._onDataChange();
                        });

                        if (settings.removerBefore) {
                            item.prepend(remover);
                        } else {
                            item.append(remover);
                        }
                        if (settings.sortable && $.ui) {
                            item.draggable({
                                containment: components.multiValueItemsContainer,
                                handle: valueObject,
                                revert: true,
                                zIndex: 1000
                            });
                            item.droppable({
                                accept: function (obj) {
                                    return obj.data('data') != undefined;
                                },
                                drop: function (event, ui) {
                                    var fromData = $(ui.draggable).data('data');
                                    var fromIndex = components.data.indexOf(fromData);
                                    var toData = $(this).data('data');
                                    var toIndex = components.data.indexOf(toData);
                                    components.data[fromIndex] = toData;
                                    components.data[toIndex] = fromData;
                                    methods._redraw();
                                    methods._onDataChange();
                                },
                                activate: function (event, ui) {

                                },
                                deactivate: function (event, ui) {
                                }
                            });
                        }
                        components.multiValueItemsContainer.append(item);
                        components.items.push(item);
                    });
                },
                _init: function () {
                    if (components.originalInput.val().trim().length != 0) {
                        components.data = components.originalInput.val().split(settings.separator);
                    }
                    components.originalInput.hide();
                    components.originalInput.replaceWith(components.multiValue);
                    components.originalInput.appendTo(components.multiValue);
                    components.newInput.appendTo(components.multiValueInputContainer);
                    components.multiValueInputContainer.appendTo(components.multiValue);
                    components.multiValueItemsContainer.appendTo(components.multiValue);
                    methods._redraw(this);
                    $(components.newInput).keypress(function (e) {
                        if (13 == (e.keyCode ? e.keyCode : e.which)) {
                            if (methods._acceptValue($(this).val())) {
                                components.data.push($(this).val());
                                components.newInput.val('');
                                components.newInput.focus();
                                methods._redraw();
                            }

                        }
                    });


                }
            }

            var defaults = {
                separator: ";",
                regex: null,
                allowMultiple : false,
                template: "<div/>",
                inputContainerTemplate: "<div/>",
                itemsContainerTemplate: "<div/>",
                itemTemplate: "<span/>",
                valueTemplate: "<span/>",
                removerTemplate: "<span>&nbsp;[-]&nbsp;</span>",
                removerBefore: false,
                sortable: true,
                onDataChange: function () { return null; },
                onOrderChange: function () { return null; }
            }

            var settings = $.extend({}, defaults, options);

            var components = {
                originalInput: null,
                newInput: $('<input type="text"/>'),
                multiValue: $(settings.template),
                multiValueInputContainer: $(settings.inputContainerTemplate),
                multiValueItemsContainer: $(settings.itemsContainerTemplate),
                data: [],
                items: []
            }

            components.originalInput = $(this);
            methods._init();

        });
        return $(this);

    }
})(jQuery);
