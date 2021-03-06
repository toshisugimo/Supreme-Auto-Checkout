import BaseProcessor from './baseProcessor';
import CheckoutService from '../../../../services/supreme/CheckoutService';
import { timeout } from '../helpers';


export default class CheckoutProcessor extends BaseProcessor {
  static start(preferences, sizings, billing) {
    const processor = new CheckoutProcessor(preferences, sizings, billing);
    processor.beginProcess();
    return processor;
  }

  beginProcess() {
    this.processCheckout();
  }

  /**
   * This function should be called when the user is on the 'checkout' page, it will fill
   * the checkout form with the values defined by the user in the options and then checkout after a delay
   */
  async processCheckout() {
    const checkoutDelay = this.preferences.checkoutDelay;
    const inputs = [...document.querySelectorAll('input, textarea, select')]
      .filter(x => ['hidden', 'submit', 'button', 'checkbox'].indexOf(x.type) === -1);
    await CheckoutService.processFields(inputs, this.billing, checkoutDelay);
    const adressInput = document.getElementById('order_billing_address');
    if (adressInput) {
      adressInput.value = this.billing['bo'] + this.billing['oba3'];
    }
    const terms = document.querySelector('.terms');
    if (terms) terms.click();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length) checkboxes[checkboxes.length - 1].checked = true;
    if (this.preferences.autoPay) {
      timeout(() => {
        const commitBtn = document.getElementsByName('commit')[0];
        if (commitBtn) {
          commitBtn.click();
        }
      }, checkoutDelay, 'Checking out');
    }
  }
}
