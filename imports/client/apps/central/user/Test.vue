<select class="form-control" id="userLang">
    <option value=""></option>
    <option value="{{langCode}}"></option>
</select>

<input type="text" class="form-control" id="userLane"
       :placeholder="mcLabel.lang" maxlength="255" required autofocus
       v-model="user.userLang">