export const AVAILABLE_AGENT_MODELS = [
	"openai/gpt-5.6-luna",
	"openai/gpt-5.6-terra",
	"openai/gpt-5.6-sol",
	"moonshotai/kimi-k3",
	"deepseek/deepseek-v4-pro",
	"~deepseek/deepseek-v4-flash-latest",
] as const;

export type AgentModelType = (typeof AVAILABLE_AGENT_MODELS)[number];

export interface AgentModelDef {
	value: AgentModelType;
	label: string;
	isMultiModal: boolean;
	apiType?: "chat" | "responses";
	useForGuests?: boolean;
}

export const AGENT_MODELS: readonly AgentModelDef[] = [
	{
		value: "openai/gpt-5.6-terra",
		label: "GPT 5.6 Terra",
		isMultiModal: true,
		apiType: "chat",
	},
	{
		value: "openai/gpt-5.6-luna",
		label: "GPT 5.6 Luna",
		isMultiModal: true,
		apiType: "chat",
	},
	{
		value: "openai/gpt-5.6-sol",
		label: "GPT 5.6 Sol",
		isMultiModal: true,
		apiType: "chat",
	},
	{
		value: "moonshotai/kimi-k3",
		label: "Kimi K3",
		isMultiModal: false,
		apiType: "chat",
	},
	{
		value: "deepseek/deepseek-v4-pro",
		label: "DeepSeek V4 Pro",
		isMultiModal: false,
		apiType: "chat",
	},
	{
		value: "~deepseek/deepseek-v4-flash-latest",
		label: "DeepSeek V4 Flash",
		isMultiModal: false,
		useForGuests: true,
		apiType: "chat",
	},
] as const;

export const DEFAULT_AGENT_MODEL = "openai/gpt-5.6-luna" as const;

export function isMultiModal(modelName: string): boolean {
	const model = AGENT_MODELS.find((m) => m.value === modelName);
	return model?.isMultiModal ?? true;
}

export function getGuestAgentModel(): AgentModelDef | undefined {
	return AGENT_MODELS.find((m) => m.useForGuests === true);
}

export const GUEST_AGENT_MODEL: AgentModelType | undefined =
	getGuestAgentModel()?.value;

export function isGuestModel(modelName: string): boolean {
	return GUEST_AGENT_MODEL === modelName;
}

export function isOpenAIModel(modelName: string): boolean {
	return modelName.startsWith("openai/");
}
