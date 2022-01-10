    const camp = new Campground({
      location: `${cities[random1000].city} ${cities[random1000].state}`
    })
    await camp.save();