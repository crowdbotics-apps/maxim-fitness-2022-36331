export const getDisplayNameFromFieldName = name => {
  switch (name) {
    case "password":
      return "password"
    case "old_password":
      return "Old password"
    case "confirm_password":
      return "Confirm password"
    case "last_name":
      return "last name"
    default:
      return name
  }
}

export const handleTextChange = (text, setValue) => {
  if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
    text === "." ? setValue("") : setValue(text)
  }
}

export const transformData = jsonData => {
  const transformedData = []
  jsonData.forEach(entry => {
    // Extract exercises
    const exercisesData = entry?.exercises?.type
    const exercises = exercisesData.map(exercise => exercise?.id)

    let sets = []
    if (entry?.dualSets && entry?.dualSets) {
      const arrayList = entry?.dualSets.map(item => {
        return Object.values(item).map(exercise => ({ ...exercise }))
      })
      sets = arrayList.flat().map((set, index) => ({
        ...set,
        ex_id: exercises[index % exercises.length] // Assign sequential exercise ID
      }))
    } else if (entry?.single && entry?.single) {
      sets = entry.single.map((set, index) => ({
        ...set,
        ex_id: exercises[index % exercises.length] // Assign sequential exercise ID
      }))
    }
    const transformedEntry = {
      exercises,
      custom_sets: sets
    }
    transformedData.push(transformedEntry)
  })
  return transformedData
}

export const sortExercises = (exercises, exercisesOrder) => {
  if (exercisesOrder?.length) {
    const orderMap = new Map();
    exercisesOrder.forEach(item => {
      orderMap.set(item.exercise, item.order);
    });

    exercises.sort((a, b) => {
      const orderA = orderMap.get(a.id);
      const orderB = orderMap.get(b.id);
      return orderA - orderB;
    });
    return exercises
  }
  else {
    return exercises
  }
}


export const exerciseArray = [
  {
    value: 1,
    heading: "Fat loss",
    description: "weight loss, figure change, general wellness"
  },
  {
    value: 2,
    heading: "Strength and Hypertrophy",
    description: "powerlifting and bodybuilding"
  },
  {
    value: 3,
    heading: "Maintenance",
    description: "maintain current weight/figure"
  }
]

export const calculateTotalValue = nutrientsArray => {
  let totalValue = 0

  for (const nutrient of nutrientsArray) {
    if (nutrient.attr_id === 208) {
      totalValue += nutrient.value
    }
  }

  return totalValue
}

export const sortData = data => {
  const compareDates = (a, b) => new Date(a.date_time) - new Date(b.date_time)
  const sortedData = data?.sort(compareDates)
  return sortedData
}

export const getServerError = (errorObject, errorMessage) => {
  if (errorObject) {
    try {
      if (typeof errorObject === "string") {
        return errorObject
      }

      const fields = Object.keys(errorObject)
      const messages = []

      fields.forEach(fieldName => {
        const message = errorObject[fieldName]
        if (fieldName === "non_field_errors") {
          if (typeof message === "string") {
            messages.push(`${message}`)
          } else if (typeof message === "object") {
            const messageContentData = Object.values(message)
            const messageContent = messageContentData && messageContentData[0]

            messages.push(`${messageContent}`)
          }
        } else {
          const displayName = getDisplayNameFromFieldName(fieldName)
          if (typeof message === "string") {
            messages.push(
              !Number.isNaN(Number(displayName))
                ? message
                : `${message} ${displayName}`
            )
          } else if (typeof message === "object") {
            const messageContentData = Object.values(message)
            const messageContent = messageContentData && messageContentData[0]

            messages.push(
              !Number.isNaN(Number(displayName))
                ? messageContent
                : `${messageContent} (${displayName})`
            )
          }
        }
      })

      return messages.join(" ~ ")
    } catch (e) {
      console.log("e :>> ", e)
      return errorMessage
    }
  }

  return null
}
