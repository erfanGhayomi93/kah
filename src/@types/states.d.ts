declare type TLoginModalStates = 'phoneNumber' | 'login-with-otp' | 'welcome' | 'login-with-password' | 'set-password';

declare type LightstreamStatus =
	| 'CONNECTING'
	| 'CONNECTED:STREAM-SENSING'
	| 'CONNECTED:WS-STREAMING'
	| 'CONNECTED:HTTP-STREAMING'
	| 'CONNECTED:WS-POLLING'
	| 'CONNECTED:HTTP-POLLING'
	| 'STALLED'
	| 'DISCONNECTED:WILL-RETRY'
	| 'DISCONNECTED:TRYING-RECOVERY'
	| 'DISCONNECTED';

declare type TSaturnBaseSymbolContracts = (string | null)[];

declare interface SymbolContractModalStates {
	term: string;
	contract: null | Option.Root;
	contractType: Record<'id' | 'title', string>;
	activeSettlement: Option.BaseSettlementDays | null;
}
