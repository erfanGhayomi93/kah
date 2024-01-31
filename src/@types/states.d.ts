declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TSaturnBaseSymbolContracts = (string | null)[];

declare interface SymbolContractModalStates {
	term: string;
	contract: null | Option.Root;
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}
