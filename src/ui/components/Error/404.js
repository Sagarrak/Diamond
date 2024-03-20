// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import '../../scss/button.scss'


// ** Logo
import foreveryLogo from '../../../assets/images/pages/header-logo.png';
import vectors from '../../../assets/images/illustration/page-not-found.svg'


const Error = () => {
  // ** Hooks
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    // source = require(`@src/assets/images/pages/${illustration}`).default
    source = require(`@src/assets/images/pages/${illustration}`)
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img src={foreveryLogo} alt="forevery" style={{ width: "70%" }} />
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1 outfit-thin'>Page Not Found 🕵🏻‍♀️</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' className='mb-2 common-button'>
            Back to home
          </Button>
          <img className='img-fluid' src={vectors} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
