class Token {
    constructor(userID, role) {
        this.user_id = userID;
        this.role = role;
    }

    toJson() {
        return {
            user_id: this.user_id,
            role: this.role
        };
    }
}

module.exports = {
    Token: Token,
};