//{
//  version: '2022.01',
//  created_at: '2021-01-01T12:00:00+00:00',
//  id: '00000000-0000-0000-0000-000000000000',
//  type: 'donation',
//  amount_raw: 69420,
//  cut: 3471,
//  donator_name: 'Someguy',
//  donator_email: 'someguy@example.com',
//  donator_is_user: false,
//  message: 'THIS IS A FAKE MESSAGE! HAVE A GOOD ONE',
//  etc: { amount_to_display: 69420 }
//}
export default class SaweriaWebhook {
	id: string = "";
	version: string = "";
	created_at: string = "";
	type: string = "";
	amount_raw: number = 0;
	cut: number = 0;
	donator_name: string = "";
	donator_email: string = "";
	donator_is_user: boolean = false;
	message: string = "";
	etc: { amount_to_display: number } = {
		amount_to_display: 0,
	}

	constructor(raw: any) {
		// This is a blessing from above
		Object.assign(this, raw);
	}

	get amount(): number {
		return this.amount_raw;
	}
}
