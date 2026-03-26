const cancel = () => {
  router.back()
}

const save = async () => {
  if (!form.name || !form.name.trim()) return alert('请输入档案名称')
  if (!form.birthDate) return alert('请选择出生日期')
  if (!form.birthTime) return alert('请选择出生时间')
  if (!form.location.name) return alert('请选择出生地点')

  saving.value = true
  try {
    const data = {
      name: form.name.trim(),
      gender: form.gender,
      birth_date: form.birthDate,
      birth_time: form.birthTime,
      location: form.location
    }

    if (isEdit.value && profileId.value) {
      await api.put(`/profiles/${profileId.value}`, data)
    } else {
      await api.post('/profiles', data)
    }

    const currentProfile = {
      id: profileId.value || Date.now(),
      name: form.name.trim(),
      gender: form.gender,
      birth_date: form.birthDate,
      birth_time: form.birthTime,
      location: {
        name: form.location.name,
        lat: form.location.lat,
        lng: form.location.lng
      }
    }

    try {
      const profileJson = JSON.stringify(currentProfile)
      if (profileJson.length < 2000) {
        localStorage.setItem('currentProfile', profileJson)
      } else {
        localStorage.setItem('currentProfile', JSON.stringify({
          id: currentProfile.id,
          name: currentProfile.name
        }))
      }
    } catch {
      console.warn('Failed to save currentProfile to localStorage')
    }

    router.push('/profiles')
  } catch (e: any) {
    console.error('保存档案失败:', e)
    alert(e.response?.data?.error || '保存失败，请重试')
  } finally {
    saving.value = false
  }
}
