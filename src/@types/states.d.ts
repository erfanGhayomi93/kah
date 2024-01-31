declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type TSaturnBaseSymbolContracts = [string | null, string | null, string | null, string | null];

declare interface SymbolContractModal {
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}
