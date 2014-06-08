db.policecrawl.aggregate(
{$match: {created:{$gte: new ISODate('2014-06-01')}} },
{$project:{
    text:1,
    entities:1,
    retweet_count:1,
    favorite_count:1
    }
},
{$unwind:"$entities.hashtags"},
{$group: {_id: '$entities.hashtags.text', eventsPerHashtag: {$sum:  1} } },
{$sort: { eventsPerHashtag: -1 } }

    )