export default {
    methods: {
        formatDate(dateString) {
            const date = new Date(dateString);

            return new Intl.DateTimeFormat('fr').format(date);
        }
    }
}