
document.addEventListener('DOMContentLoaded', () => {
        const taxSwitch = document.getElementById("flexSwitchCheckDefault");
        taxSwitch.addEventListener("click", () => {
                let taxInfos = document.querySelectorAll(".tax-info");
                taxInfos.forEach(element => {
                        element.classList.toggle("tax-info-display");
                });
        });

        const filters = document.querySelectorAll('.filter');
        const listingsContainer = document.querySelector('.listings-container');
        const listings = document.getElementById('listings');
        const loader = document.getElementById('loader');
        const noListings = document.getElementById('no-listings');

        filters.forEach(filter => {
                filter.addEventListener('click', () => {
                        const category = filter.getAttribute('data-category');

                        filters.forEach(f => f.classList.remove('active'));
                        filter.classList.add('active');


                        loader.style.display = 'flex';
                        noListings.style.display = 'none';
                        listings.style.display = 'none';

                        setTimeout(() => {
                                const listingItems = listings.querySelectorAll('.listing');
                                let hasVisibleListings = false;

                                listingItems.forEach(listing => {
                                        if (category === 'all' || listing.getAttribute('data-category') === category) {
                                                listing.style.display = 'block';
                                                hasVisibleListings = true;
                                        } else {
                                                listing.style.display = 'none';
                                        }
                                });


                                loader.style.display = 'none';
                                if (hasVisibleListings) {
                                        listings.style.display = 'flex';
                                } else {
                                        noListings.style.display = 'block';
                                }
                        }, 500);
                });
        });

        const listingItems = listings.querySelectorAll('.listing');
        if (listingItems.length === 0) {
                noListings.style.display = 'block';
        } else {
                listingItems.forEach(listing => {
                        listing.style.display = 'block';
                });
        }
});
