import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GuestType } from "../../Types/LandingPage";
import { ACTIVE_TENANT,  BASE_URL } from "../../Util/API";

export interface TenantConfig {
   tenant_id: number;
   tenantName: string;
   tenantLogoHeader: string;
   tenantHeaderName: string;
   tenantLogoFooter: string;
   tenantFooterCompanyText: string;
   properties: string[];
   configurationsByProperty: PropertyConfig[];
}

export interface NarrowRoomResultPageFilter {
   name: string;
   values: string[];
}

export interface SortingFilters {
   field: string;
   both: boolean;
}

export interface PropertyConfig {
   name: string;
   languages: string[];
   currencies: string[];
   bannerImage: string;
   landingPageFilters: string[];
   narrowRoomResultPageFilters: NarrowRoomResultPageFilter[];
   sortingFilters: SortingFilters[];
   allowedGuests: GuestType[];
   maxRoomAllowed: number;
   maxBedAllowed: number;
   maxGuestAllowedAtTime: number;
   vat: number;
   resortFee: number;
   occupancyTax: number;
   dueNow: number;
}

export interface FilterStateSlice {
   selectedProperty: string;
   selectedRooms: number;
   selectedGuests: Record<string, number>;
   selectedBed: number;
   startDate: Date;
   endDate: Date;
   narrowResultFiltersState: Record<string, string[]>;
   selectedSortFilter: string;
}

export interface LandingPageConfigSliceType {
   tenantConfig: TenantConfig;
   currentConfig: PropertyConfig;
   filterStates: FilterStateSlice;
   loading: boolean;
   error: string;
}

export const fetchConfig = createAsyncThunk(
   "LandingPageConfigurations/fetchConfig",
   async () => {
      try {
         const response = await fetch(
            `${BASE_URL}/api/v1/config/${ACTIVE_TENANT}`
         );
         const result = await response.json();
         return result;
      } catch (err) {
         throw new Error("An error occurred while fetching config: " + err);
      }
   }
);

const initialState: LandingPageConfigSliceType = {
   tenantConfig: {
      tenant_id: 1,
      tenantName: "",
      tenantFooterCompanyText: "",
      tenantHeaderName: "",
      tenantLogoFooter: "",
      tenantLogoHeader: "",
      properties: [],
      configurationsByProperty: [],
   },
   currentConfig: {
      name: "",
      languages: [],
      currencies: [],
      bannerImage: "",
      landingPageFilters: [],
      narrowRoomResultPageFilters: [],
      sortingFilters: [],
      allowedGuests: [],
      maxRoomAllowed: 5,
      maxBedAllowed: 3,
      maxGuestAllowedAtTime: 10,
      vat: 0.18,
      dueNow: 0.5,
      occupancyTax: 0.05,
      resortFee: 0.05,
   },
   filterStates: {
      selectedProperty: "",
      selectedBed: 1,
      selectedGuests: {},
      selectedRooms: 1,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 86400000 * 2),
      narrowResultFiltersState: {},
      selectedSortFilter: "Price",
   },
   loading: false,
   error: "",
};

const LandingPageConfigSlice = createSlice({
   name: "LandingPageConfigurations",
   initialState,
   reducers: {
      setCountByName: (
         state,
         action: PayloadAction<{ name: string; count: number }>
      ) => {
         const { name, count } = action.payload;
         state.filterStates.selectedGuests[name] = count;
      },
      increaseGuestCountByName: (state, action: PayloadAction<string>) => {
         let total = Object.values(state.filterStates.selectedGuests).reduce(
            (accumulator, value) => accumulator + value,
            0
         );
         if (
            state.filterStates.selectedGuests[action.payload] <
               state.filterStates.selectedRooms * 2 &&
            total <= state.currentConfig.maxGuestAllowedAtTime
         ) {
            state.filterStates.selectedGuests[action.payload]++;
         }
      },
      decreaseGuestCountByName: (state, action: PayloadAction<string>) => {
         if (state.filterStates.selectedGuests[action.payload] > 0) {
            if (
               action.payload === "Adults" &&
               state.filterStates.selectedGuests[action.payload] ===
                  state.filterStates.selectedRooms
            ) {
               return;
            }
            state.filterStates.selectedGuests[action.payload]--;
         }
      },
      setSelectedRoom: (state, action: PayloadAction<number>) => {
         state.filterStates.selectedRooms = action.payload;
         state.filterStates.selectedGuests["Adults"] = action.payload;
         Object.keys(state.filterStates.selectedGuests).map((key) => {
            if (key !== "Adults") {
               state.filterStates.selectedGuests[key] = Math.min(
                  2 * action.payload,
                  state.filterStates.selectedGuests[key]
               );
            } else {
               state.filterStates.selectedGuests[key] = action.payload;
            }
         });
      },
      setSelectedBeds: (state, action: PayloadAction<number>) => {
         state.filterStates.selectedBed = action.payload;
      },
      setSelectedSortFilter: (state, action: PayloadAction<string>) => {
         state.filterStates.selectedSortFilter = action.payload;
      },
      setSelectedProperty: (state, action: PayloadAction<string>) => {
         state.filterStates.selectedProperty = action.payload;
         const propertyConfig =
            state.tenantConfig.configurationsByProperty.find(
               (propertyConfig) =>
                  propertyConfig.name === state.filterStates.selectedProperty
            );
         if (propertyConfig) {
            state.currentConfig = propertyConfig;
            const allowed_guests = propertyConfig.allowedGuests;

            allowed_guests.forEach((allowed_guest) => {
               if (allowed_guest.isActive && allowed_guest.name === "Adults")
                  state.filterStates.selectedGuests[allowed_guest.name] = 1;
               else if (allowed_guest.isActive)
                  state.filterStates.selectedGuests[allowed_guest.name] = 0;
            });

            state.filterStates.selectedRooms = 1;
         }
      },
      setCurrentConfig: (state, action: PayloadAction<string>) => {
         const propertyConfig =
            state.tenantConfig.configurationsByProperty.find(
               (propertyConfig) => propertyConfig.name === action.payload
            );
         if (propertyConfig) {
            state.currentConfig = propertyConfig;
            propertyConfig.narrowRoomResultPageFilters.forEach(
               (narrowRoomResultPageFilter) => {
                  state.filterStates.narrowResultFiltersState[
                     narrowRoomResultPageFilter.name
                  ] = [];
               }
            );
         }
      },
      addNarrowResultFilter: (
         state,
         action: PayloadAction<{ filterName: string; value: string }>
      ) => {
         state.filterStates.narrowResultFiltersState[
            action.payload.filterName
         ].push(action.payload.value);
      },
      removeNarrowResultFilter: (
         state,
         action: PayloadAction<{ filterName: string; value: string }>
      ) => {
         state.filterStates.narrowResultFiltersState[
            action.payload.filterName
         ] = state.filterStates.narrowResultFiltersState[
            action.payload.filterName
         ].filter((filterValue) => filterValue !== action.payload.value);
      },
      setStartDate: (state, action: PayloadAction<Date>) => {
         state.filterStates.startDate = action.payload;
      },
      setEndDate: (state, action: PayloadAction<Date>) => {
         state.filterStates.endDate = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(
         fetchConfig.fulfilled,
         (state, action: PayloadAction<TenantConfig>) => {
            state.tenantConfig = action.payload;
            state.loading = false;
            state.error = "";
         }
      );
      builder.addCase(fetchConfig.pending, (state) => {
         state.loading = true;
      });
      builder.addCase(fetchConfig.rejected, (state, action) => {
         state.loading = false;
         state.error = action.error.message ?? "An error occurred";
      });
   },
});

export const {
   increaseGuestCountByName,
   decreaseGuestCountByName,
   setSelectedRoom,
   setSelectedProperty,
   setStartDate,
   setEndDate,
   setCountByName,
   setSelectedBeds,
   setCurrentConfig,
   addNarrowResultFilter,
   removeNarrowResultFilter,
   setSelectedSortFilter,
} = LandingPageConfigSlice.actions;
export default LandingPageConfigSlice.reducer;
