Vue.createApp({
  data() {
    return {
      form: {
        fullName: "",
        dateOfBirth: "",
        gender: "",
        totalVisitors: "",
        totalChildren: "",
        accommodation: "",
        cardholderName: "",
        cardNumber: "",
        expirationDate: "",
        cvv: ""
      },
      errors: {},
      generalError: "",
      places: [],
      isLoadingPlaces: false,
      placesError: "",
      selectedPlaces: [],
      accommodationOptions: [
        "No accommodation needed",
        "Forest View Hotel",
        "Totoro Family Inn",
        "Witch Valley Guesthouse",
        "Luxury Ghibli Resort"
      ],
      showSummary: false
    };
  },
  computed: {
    maskedCardNumber() {
      const digits = String(this.form.cardNumber).replace(/\D/g, "");
      if (!digits) {
        return "";
      }

      const lastFour = digits.slice(-4);
      return `**** **** **** ${lastFour}`;
    }
  },
  mounted() {
    this.loadPlaces();
  },
  methods: {
    async loadPlaces() {
      this.isLoadingPlaces = true;
      this.placesError = "";

      try {
        const response = await fetch("ghibli_park.json");

        if (!response.ok) {
          throw new Error("Unable to load places.");
        }

        this.places = await response.json();
      } catch (error) {
        if (typeof window.GHIBLI_PARK_FALLBACK !== "undefined") {
          this.places = window.GHIBLI_PARK_FALLBACK;
        } else {
          this.placesError =
            "Ghibli Park places could not be loaded. Include ghibli_park.json and ghibli_park_data.js in your submission.";
        }
      } finally {
        this.isLoadingPlaces = false;
      }
    },
    togglePlace(place) {
      const placeIndex = this.selectedPlaces.findIndex((selectedPlace) => selectedPlace.id === place.id);

      if (placeIndex >= 0) {
        this.selectedPlaces.splice(placeIndex, 1);
        return;
      }

      this.selectedPlaces.push(place);
    },
    isPlaceSelected(place) {
      return this.selectedPlaces.some((selectedPlace) => selectedPlace.id === place.id);
    },
    generateItinerary() {
      this.clearErrors();

      if (!this.validateForm()) {
        this.generalError = "There are mandatory items pending to be filled. Please complete the required fields.";
        return;
      }

      this.showSummary = true;
    },
    validateForm() {
      let isValid = true;
      const totalVisitors = Number(this.form.totalVisitors);
      const totalChildren = Number(this.form.totalChildren);

      if (!this.form.fullName) {
        this.errors.fullName = "Full name is required.";
        isValid = false;
      }

      if (!this.form.dateOfBirth) {
        this.errors.dateOfBirth = "Date of birth is required.";
        isValid = false;
      }

      if (!this.form.gender) {
        this.errors.gender = "Gender is required.";
        isValid = false;
      }

      if (this.selectedPlaces.length === 0) {
        this.errors.selectedPlaces = "Please select at least one Ghibli Park place.";
        isValid = false;
      }

      if (this.form.totalVisitors === "" || Number.isNaN(totalVisitors) || totalVisitors < 1) {
        this.errors.totalVisitors = "Total visitors must be at least 1.";
        isValid = false;
      }

      if (this.form.totalChildren === "" || Number.isNaN(totalChildren) || totalChildren < 0) {
        this.errors.totalChildren = "Total children must be 0 or more.";
        isValid = false;
      } else if (this.form.totalVisitors !== "" && totalChildren > totalVisitors) {
        this.errors.totalChildren = "Children cannot be more than total visitors.";
        isValid = false;
      }

      if (!this.form.accommodation) {
        this.errors.accommodation = "Please select an accommodation option.";
        isValid = false;
      }

      if (!this.form.cardholderName) {
        this.errors.cardholderName = "Cardholder name is required.";
        isValid = false;
      }

      if (!this.form.cardNumber) {
        this.errors.cardNumber = "Card number is required.";
        isValid = false;
      }

      if (!this.form.expirationDate) {
        this.errors.expirationDate = "Expiration date is required.";
        isValid = false;
      }

      if (!this.form.cvv) {
        this.errors.cvv = "CVV is required.";
        isValid = false;
      }

      return isValid;
    },
    clearErrors() {
      this.errors = {};
      this.generalError = "";
      this.showSummary = false;
    }
  }
}).mount("#app");
