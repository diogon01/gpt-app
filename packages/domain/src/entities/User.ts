export interface UserProps {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    plan: 'free' | 'plus';
}

export class User {
    constructor(private props: UserProps) { }

    get uid() {
        return this.props.uid;
    }

    get displayName() {
        return this.props.displayName;
    }

    get email() {
        return this.props.email;
    }

    get plan() {
        return this.props.plan;
    }

    isPlus(): boolean {
        return this.props.plan === 'plus';
    }
}
