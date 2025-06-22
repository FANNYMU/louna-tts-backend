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
	createdAt: string = "";
	type: string = "";
	amountRaw: number = 0;
	cut: number = 0;
	donatorName: string = "";
	donatorEmail: string = "";
	donatorIsUser: boolean = false;
	message: string = "";
	etc: { amountToDisplay: number } = {
		amountToDisplay: 0,
	}

	constructor(raw: any) {
		// This is a blessing from above
		Object.assign(this, raw);
	}
}
