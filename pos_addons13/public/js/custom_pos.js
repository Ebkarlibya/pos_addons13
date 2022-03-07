$(document).ready(function () {
    waitForElementToDisplay("div.filter-section", () => {
        var pos = frappe.pages['point-of-sale'].pos;
        jQuery(`
            <div class="vehicle-filter-fields" style="display: flex; margin: 0px 20px 0px 20px;">
                <div class="vehicle-make" style="margin-right: 10px"></div>
                <div class="vehicle-model" style="margin-right: 10px"></div>
                <div class="vehicle-year" style="margin-right: 10px"></div>
                <div class="vehicle-engine"></div>
            </div>
        `).insertAfter("div.filter-section");


        this.vehicle_make = frappe.ui.form.make_control({
            df: {
                label: __('Vehicle Make'),
                fieldtype: 'Link',
                options: 'Vehicle Manufacturers',
                placeholder: __('Vehicle Make'),
                onchange: (e) => {
                    if (this.vehicle_make.get_value()) {
                        this.vehicle_model.input.disabled = false;
                    } else {
                        this.vehicle_model.input.disabled = true;
                    }
                    pos.item_selector.filter_items();
                }
            },
            parent: document.querySelector("div.vehicle-make"),
            render_input: true,
        });

        this.vehicle_model = frappe.ui.form.make_control({
            df: {
                label: __('Vehicle Model'),
                fieldtype: 'Link',
                options: 'Vehicles Model',
                placeholder: __('Vehicle Make'),
                onchange: (e) => {
                    if (this.vehicle_model.get_value()) {
                        this.vehicle_year.input.disabled = false;
                    } else {
                        this.vehicle_year.input.disabled = true;
                    }
                    pos.item_selector.filter_items();
                },
                get_query: () => {
                    return {
                        filters: [
                            ['vehicle_manufacturers', '=', this.vehicle_make.get_value()]
                        ]
                    }
                }
            },
            parent: document.querySelector("div.vehicle-model"),
            render_input: true,
        });
        this.vehicle_model.input.disabled = true;

        this.vehicle_year = frappe.ui.form.make_control({
            df: {
                label: __('Vehicle Year'),
                fieldtype: 'Link',
                options: 'Model Year',
                placeholder: __('Vehicle Year'),
                onchange: (e) => {
                    if (this.vehicle_year.get_value()) {
                        this.vehicle_engine.input.disabled = false;
                    } else {
                        this.vehicle_engine.input.disabled = true;
                    }
                    pos.item_selector.filter_items();
                }
            },
            parent: document.querySelector("div.vehicle-year"),
            render_input: true,
        });
        this.vehicle_year.input.disabled = true;

        this.vehicle_engine = frappe.ui.form.make_control({
            df: {
                label: __('Vehicle Engine'),
                fieldtype: 'Link',
                options: 'Engine',
                placeholder: __('Vehicle Engine'),
                onchange: (e) => {
                    pos.item_selector.filter_items();
                }
            },
            parent: document.querySelector("div.vehicle-engine"),
            render_input: true,
        });
        this.vehicle_engine.input.disabled = true;


        var thiz = this;
        erpnext.PointOfSale.ItemSelector.prototype.get_items = function (ref) {
            var start = ref.start; if (start === void 0) start = 0;
            var page_length = ref.page_length; if (page_length === void 0) page_length = 40;
            var search_term = ref.search_term; if (search_term === void 0) search_term = '';
            var doc = this.events.get_frm().doc;
            var price_list = (doc && doc.selling_price_list) || this.price_list;
            var ref$1 = this;
            var item_group = ref$1.item_group;
            var pos_profile = ref$1.pos_profile;

            !item_group && (item_group = this.parent_item_group);

            return frappe.call({
                method: "erpnext.selling.page.point_of_sale.point_of_sale.get_items",
                freeze: true,
                args: {
                    start: start,
                    page_length: page_length,
                    price_list: price_list,
                    item_group: item_group,
                    search_term: search_term,
                    pos_profile: pos_profile,
                    vehicle_make: thiz.vehicle_make.get_value(),
                    vehicle_model: thiz.vehicle_model.get_value(),
                    vehicle_year: thiz.vehicle_year.get_value(),
                    vehicle_engine: thiz.vehicle_engine.get_value(),
                },
            });
        }

    }, 200, 9000);

    function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
        var startTimeInMs = Date.now();
        (function loopSearch() {
            if (document.querySelector(selector) != null) {
                callback();
                return;
            }
            else {
                setTimeout(function () {
                    if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                        return;
                    loopSearch();
                }, checkFrequencyInMs);
            }
        })();
    }
});
