<TabsContent value="multiple">
  <Card>
    <CardHeader>
      <CardTitle>Simulation pour plusieurs employés</CardTitle>
      <CardDescription>
        Calculez les salaires pour plusieurs employés en même temps
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {employees.map((employee, index) => (
          <div key={index} className="p-4 border rounded-lg relative">
            <Button
              variant="ghost"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => removeEmployee(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Nom de l'employé</Label>
                <Input
                  placeholder="Ex: Jean Dupont"
                  value={employee.name}
                  onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                />
              </div>
              <div>
                <Label>Salaire brut mensuel (FCFA)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 250000"
                  value={employee.grossSalary || ''}
                  onChange={(e) => updateEmployee(index, 'grossSalary', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Situation familiale</Label>
                <Select 
                  value={employee.familyStatus}
                  onValueChange={(value) => updateEmployee(index, 'familyStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Célibataire</SelectItem>
                    <SelectItem value="married">Marié(e)</SelectItem>
                    <SelectItem value="divorced">Divorcé(e)</SelectItem>
                    <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nombre d'enfants</Label>
                <Select
                  value={employee.children}
                  onValueChange={(value) => updateEmployee(index, 'children', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {employee.results && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Salaire net:</span>
                  <span className="text-lg font-bold text-benin-green">
                    {formatCurrency(employee.results.salaireNet)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addEmployee}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>

        <Button
          onClick={calculateMultipleResults}
          className="w-full bg-benin-green hover:bg-benin-green/90 text-lg py-6"
          disabled={employees.length === 0}
        >
          Calculer tous les salaires
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {multipleResults && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé des calculs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total salaires bruts:</span>
                    <span className="font-bold">
                      {formatCurrency(multipleResults.totalGross)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total charges sociales:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(multipleResults.totalSocialCharges)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span>Total impôts:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(multipleResults.totalTax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-benin-green/10 rounded-lg">
                    <span className="font-bold text-benin-green">Total salaires nets:</span>
                    <span className="text-xl font-bold text-benin-green">
                      {formatCurrency(multipleResults.totalNet)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadMultiplePDF}
                    className="flex-1"
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSendMultipleEmail}
                    className="flex-1"
                    disabled={isSendingEmail}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {isSendingEmail ? 'Envoi en cours...' : 'Envoyer par email'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
</TabsContent> 