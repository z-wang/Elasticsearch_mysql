var queryObj = {
                            from : 0,
                            size : 1000,
                            query : {
                                bool : {
                                    should : [
                                        {
                                            wildcard : {
                                                "gsam entity name" : "*" + searchQuery + "*"
                                            }
                                        },
                                        {
                                            wildcard : {
                                                "display" : "*" + searchQuery + "*"
                                            }
                                        },
                                        {
                                            wildcard : {
                                                "entity security name" : "*" + searchQuery + "*"
                                            }
                                        }
                                    ],
                                    "minimum_should_match" : 1,
                                    "boost" : 1.0
                                }
                            }
                        }
