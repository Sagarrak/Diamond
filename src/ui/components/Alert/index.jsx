
//library
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

//css
import '../../../@core/scss/base/plugins/extensions/ext-component-sweet-alerts.scss';

const MySwal = withReactContent(Swal)
export const ConfirmationModal = (status, title, text, btnText) => {
  let informationMessage = {
    title: title,
    text: text,
    icon: status,
    buttonsStyling: false
  }
  if (status !== 'success') {
    informationMessage.showCancelButton = true,
      informationMessage.confirmButtonText = btnText
    informationMessage.customClass = {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-outline-danger ms-1'
    }
  } else {
    informationMessage.customClass = {
      confirmButton: 'btn btn-success'
    }
  }
  return MySwal.fire(informationMessage).then(function (result) {
    return result.value;
  })
}

