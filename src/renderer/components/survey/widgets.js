import * as widgets from 'surveyjs-widgets'

window.jQuery = window.$ = require('jquery')
import 'jquery-ui/themes/base/all.css'
import 'jquery-ui/ui/i18n/datepicker-zh-CN'
import 'jquery-ui/ui/widgets/datepicker'
import 'select2/dist/css/select2.css'
import 'select2/dist/js/select2'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import 'bootstrap-slider/dist/bootstrap-slider'
// import 'inputmask/dist/inputmask/inputmask'
import 'nouislider/distribute/nouislider.css'
import 'nouislider/distribute/nouislider'
import 'signature_pad/dist/signature_pad'
import 'sortablejs/Sortable'

export function init(Survey) {
  widgets.icheck(Survey)
  widgets.select2(Survey)
  widgets.inputmask(Survey)
  widgets.jquerybarrating(Survey)
  widgets.jqueryuidatepicker(Survey)
  widgets.nouislider(Survey)
  widgets.select2tagbox(Survey)
  widgets.signaturepad(Survey)
  widgets.sortablejs(Survey)
  widgets.ckeditor(Survey)
  widgets.autocomplete(Survey)
// widgets.bootstrapslider(Survey)
}
