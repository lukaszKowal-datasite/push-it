export interface NotificationEvent {
    userId: string;
    projectId: string;
    event: Event;
}

export type Template = 'QANDA_INSTANT_POST_SUBMITTED_QUESTION';

export interface Event {
    template: Template;
    templateParams: Record<string, any>;
};

