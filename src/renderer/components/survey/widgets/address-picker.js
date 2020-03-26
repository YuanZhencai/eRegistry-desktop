export function init(Survey, $) {
  $ = $ || window.$
  const widget = {
    name: 'address',
    title: 'address',
    iconName: '',
    htmlTemplate: '' +
        '<div>' +
        "   <div class='form-inline'>" +
        '       <div>' +
        "           <select name='province' class='form-control'></select>" +
        "           <select name='city' class='form-control'></select>" +
        "           <select name='district' class='form-control'></select>" +
        '       </div>' +
        '   </div>' +
        "   <div class='form-inline mt-2'>" +
        "       <textarea name='street' class='form-control' style='width: 100%'></textarea>" +
        '   </div>' +
        '</div>',
    widgetIsLoaded: function() {
      return !!$ && !!$.fn.distpicker
    },
    isFit: function(question) {
      return question.getType() === 'address'
    },
    activatedByChanged: function(activatedBy) {
      if (!this.widgetIsLoaded()) return
      Survey.JsonObject.metaData.addClass('address', [], null, 'empty')
      Survey.JsonObject.metaData.addProperties('address', {
        province: '---- 所在省 ----',
        city: '---- 所在市 ----',
        district: '---- 所在区 ----',
        street: null
      })
    },
    afterRender: function(question, el) {
      const $address = $(el)
      const province = $address.find("select[name='province']")
      const city = $address.find("select[name='city']")
      const district = $address.find("select[name='district']")
      const street = $address.find("textarea[name='street']")
      const value = question.value
      $address.distpicker(value)

      if (value && value.street) {
        street.val(value.street)
      }

      const saveAddress = function(e) {
        question.value = {
          province: province.val(),
          city: city.val(),
          district: district.val(),
          street: street.val()
        }
      }
      $address.find('select').on('change', saveAddress)
      street.on('change', saveAddress)
    },
    willUnmount: function(question, el) {
      if (question.address) {
        question.address.off()
      }
      question.address = null
    }
  }

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customtype')
}
