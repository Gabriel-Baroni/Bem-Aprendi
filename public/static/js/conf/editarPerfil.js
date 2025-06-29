import supabase from '../db/supabaseClient.js';
// Suponha que você tenha o ID da criança salvo no localStorage
const idCrianca = localStorage.getItem('crianca_id')

// Atualizar Nome
document.getElementById('form-nome').addEventListener('submit', async (e) => {
  e.preventDefault()
  const novoNome = document.getElementById('novo-nome').value

  const { error } = await supabase
    .from('Crianca')
    .update({ nome: novoNome })
    .eq('id', idCrianca)

  if (error) {
    alert('Erro ao atualizar nome: ' + error.message)
  } else {
    localStorage.setItem('crianca_nome', novoNome)
    document.getElementById('form-nome').reset()
    bootstrap.Modal.getInstance(document.getElementById('modalNome')).hide()
  }
})

// Atualizar Idade
document.getElementById('form-idade').addEventListener('submit', async (e) => {
  e.preventDefault()
  const novaIdade = parseInt(document.getElementById('nova-idade').value)

  const { error } = await supabase
    .from('Crianca')
    .update({ idade: novaIdade })
    .eq('id', idCrianca)

  if (error) {
    alert('Erro ao atualizar idade: ' + error.message)
  } else {
    alert('Idade atualizada com sucesso!')
    document.getElementById('form-idade').reset()
    bootstrap.Modal.getInstance(document.getElementById('modalIdade')).hide()
  }
})
