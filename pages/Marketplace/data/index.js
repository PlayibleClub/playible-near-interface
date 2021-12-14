export const sortOptions = [
  {
    key: "default",
    name: "Sort by",
    sorter: (a,b) => a.id - b.id
  },
  {
    key: "lowserial",
    name: "Lowest Serial Number",
    sorter: (a,b) => a.id - b.id
  },
  {
    key: "highserial",
    name: "Highest Serial Number",
    sorter: (a,b) => b.id - a.id
  },
  {
    key: "newlisting",
    name: "Newest Listing",
    sorter: (a,b) => new Date(...a.listing.split('/').reverse()) - new Date(...b.listing.split('/').reverse())
  },
  {
    key: "oldlisting",
    name: "Oldest Listing",
    sorter: (a,b) => new Date(...b.listing.split('/').reverse()) - new Date(...a.listing.split('/').reverse())
  },
  {
    key: "team",
    name: "Team",
    sorter: (a,b) => a.team.localeCompare(b.team)
  },
  
]