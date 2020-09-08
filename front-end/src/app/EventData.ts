export interface EventData{
    all_day: string,
    calendar_count: number,
    calendars: null,
    city_name: string,
    comment_count: number,
    country_abbr: string,
    country_abbr2: string,
    country_name: string,
    created: string,
    description: string,
    geocode_type: string,
    going: number,
    going_count: number,
    groups: number,
    id: string,
    image: {
        small:{
            width: string,
            url: string,
            height: string,
        }
        width: string,
        caption: string,
        medium:{
            width: string,
            url: string,
            height: string,
        }
        url: string,
        thumb:{
            width: string,
            url: string,
            height: string,
        }
        height: string,
    }
    latitude: string,
    link_count: string,
    longitutde: string,
    modified: string,
    olson_path: string,
    owner: string,
    perfomers: {
        perfomer:{
            creator: string,
            linker: string,
            name: string,
            url: string,
            id: string,
            short_bio: string,
        }
    }
    postal_code: string,
    privacy: string,
    recur_string: string,
    region_abbr: string,
    region_name: string,
    start_time: string,
    stop_time: string
    title: string,
    tz_city: string,
    tz_country: string,
    tz_id: string,
    tz_olzon_path: string,
    url: string,
    venue_address: string,
    venue_display: string,
    venue_id: string,
    venue_name: string,
    venue_url: string,
    watching_count: string
}