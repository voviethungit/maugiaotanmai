import React from 'react';
import './css/footer.css';
import './css/base.css';
import { FaFacebookF, FaTiktok, FaFacebookMessenger, FaLocationDot } from "react-icons/fa6";
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';


function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__dash'></div>
      <div className='footer__content'>
        <div className='footer__content-firt'>
        <ScrollLink to='header' smooth={true} duration={800} offset={-20} delay={100}>
          <img className='footer__content-firt-img' src='https://lh3.googleusercontent.com/fife/ALs6j_E0e7rZVF1a3QQZu7wNN7YerbJAWYIEhkhokl-H9wAy1QvdVk7hHIPBjixnVUlHxeZutlTGEtmK-IuAwz9BpsymlEvf6zGmfEuOOGK800y9Vl3uYNaQcU2b4bBN7uxeAoB-bOxst069VrnRKs_kb1aMYikjDobVEXhYGvF0ce0DZ9zVyo9dY5dpVU89LeTCzMcKzkkwTrdLSSkjVJMF5uqIJp7Y3juWvzb0r1FU1GBNCFM-PVwJ9knuKCSgfNVPn0D8Bv0xrG6HzxY0Io2Vq1aaNqUCpNxlR9jnlr7LmgsrVQYKdocsmCMFr3sFMvtU_W5CC73JMr1cJb-S2ODe-aw-VrYgXT5OVZbcP4CrUomkwcGzMKdoX7SH3vdgF0PQgWvfm5_Fv8AzwHZ_NNXBfLurUgzcY0avIiMPXuy_1_Cmu1z6-M9BmNYq8tymdVjobw47d8AjFxeODq545okmh3XNKoOZiKLpWiSR3tY_QEmyK7udnnw6Z2tuWBKvqS-UeUbVJpq1IID83ihFRkdpV-UURxWXLnuC2rkPtr7EV23Jqk9q6ILz7WiegJ-FQh40_ezGbPb6_XMuCFf2TOiBQde9Fg48v_Ryuch-rlHt_EB5ysoNI5o9NQSV-LiW5vcLPWPFAgBeRdkBb6iUKe-5qDaAlNjtPilIGOdbBV5tyhLUd0mYlA_0ucdR8nHLigtRwgAIVczqopmXEELYY0QhLQWC7LGvRDPKxdWCMsNlvZ7jhYSSHz-_ar2EMkp6NMY5tef1sW3mhdwSdES2LVUdItrxkwauyBz2C9vXledUWY9rQ-Jpr_EiRwHNb506J8w-DJwAmsZF49LLHKIiFoigl37tpPcjonvvqU-lAX3Ol4DqQs_uKOwZPt6R_ShXRwBtT091dH0NRViQmmn37jeOMJ1AaJmXZKxuwG6886z414F4lHK8M-fbgfpxPvyoYTze69IS6hwYfFRakkdrgXPAdG_GFAOs9ohYBX7noFxm71q3bK7j_ID6GcHubwPhYhjTnTPJMcxiX6jfRvixpaxnq6_CXIjIqf0FxaCtSPOaSZgxg1gtXi2pijHUSTHJwIdS4-YXdWbmEDYS21g-sdkkX9-txB4Yv25SUY2YAYwiOMa74C_OMuisTqaKYVWf1icAk0mV0NB6XB26nriZ74ghU8pd6bx9QuYCG8fWx8QWgSk7Sq_5oD8PCZLeOLpQOKiRCs2lbTYs0viZUU9gweWTF7-9IKKMwNeL_sltZVtTma1aXoKwy0CdUdUy1asRrvqjMnTfNS8x4QOC6lJ59lFZY4OHpj6S8eCKV0xJokKx0lF13RD8OhfCSRMmBkkVMsKPb62IobWWhLCCuN_TJD2m1RdWgZjhV2s0f9It2UOTdMehnCnLyy4i-g5v7DP7s_JJ6G0mIwMkNN7wGIle7x8qsO-W851Bl5Ti8KDqXggMCahDoLM8PekkJfWpxDZp5PjpZLFFpaEJn2r-9U0f-YpVOVTUopS8zyObhztJGt7b6oYjomkhVqOPCfec8kWyqo3WpS85Qa4PpKjPxkbGQ7q-nKLUcbOVEsbhv85YMsTvhRvXxsKmEounN0JRLa-ogrGQWHIsb0-B3brzArO-SQ=w1920-h922'></img>           
      </ScrollLink>
      <p className='pfooter'>Tân Mai - Trường mầm non đáp ứng đầy đủ tiêu chí học tập theo tiêu chuẩn Châu Á</p>
        </div>
   <div className='footer__content-next'>
    <h3 className='h3footer'>Liên Hệ</h3>
    <br/>
    <br/>
    <div className='information'>
    <p><FaLocationDot /> Địa chỉ: Lâm Đồng</p> 
    <br/>
          <p><FaPhoneAlt /> Số điện thoại: 0123456789</p>
          <br/>
          <p><IoMail /> Email: abc@example.com</p>
          </div>
   </div>
   <div className='footer__content-next2'>
   <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31256.190018364152!2d108.25748989804954!3d11.692729065089217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31714506acf7a211%3A0x730c9b4840fad09b!2zVGjDtG4gVMOibiBCw6xuaCwgVMOibiBUaMOgbmgsIMSQ4bupYyBUcuG7jW5nLCBMw6JtIMSQ4buTbmcsIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1714994601361!5m2!1svi!2sus"
            width="500"
            height="350"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
    </div>
      </div>
    </footer>
  )
}

export default Footer
